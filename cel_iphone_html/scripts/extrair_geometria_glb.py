"""Extrai TODAS as meshes de um GLB (glTF 2.0 binario) para um JSON unico,
com os atributos reais (POSITION, NORMAL, TEXCOORD_0, COLOR_0) + nome do material.
A geometria extraida e a FONTE DA VERDADE: coordenadas de mundo (metros, Y-up),
exatamente como estao no GLB — o renderer HTML apenas carrega e desenha.

Uso:
  python -I extrair_geometria_glb.py <glb> --all --out geometria.json
  python -I extrair_geometria_glb.py <glb> --list
  python -I extrair_geometria_glb.py <glb> --mesh Back_Logo --out logo.json

Formato de saida (--all):
{
  "source": "<nome do glb>", "units": "metres",
  "order": ["Front_Cam_Lens", ...],          // ordem original dos nos
  "meshes": {
    "Front_Cam_Lens": {
      "material": "BASE_Cam_Lens_Front",
      "position": [x,y,z, ...],              // flat, metros, 6 decimais (precisao 1 um)
      "normal":   [x,y,z, ...],              // flat, 3 decimais
      "uv":       [u,v, ...],                // flat, 4 decimais
      "color":    [r,g,b, ...]|null,         // AO baked por vertice, 3 decimais
      "index":    [i, ...],                  // triangulos
      "bounds":   {"min":[...], "max":[...]}
    }, ...
  }
}
"""
import json, struct, sys, argparse

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("glb")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--mesh")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    data = open(args.glb, "rb").read()
    assert data[:4] == b"glTF", "nao e um GLB"
    off = 12; chunks = []
    while off < len(data):
        clen, ctype = struct.unpack_from("<I4s", data, off)
        chunks.append((ctype, off + 8, clen)); off += 8 + clen
    gltf = json.loads(data[chunks[0][1]:chunks[0][1] + chunks[0][2]].decode("utf-8"))
    bin_bytes = data[chunks[1][1]:chunks[1][1] + chunks[1][2]][:gltf["buffers"][0]["byteLength"]]

    NCOMP = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}
    CSIZE = {5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4}
    FMT = {5120: "b", 5121: "B", 5122: "h", 5123: "H", 5125: "I", 5126: "f"}

    def read_accessor(ai):
        acc = gltf["accessors"][ai]
        ct, t, n = acc["componentType"], acc["type"], acc["count"]
        nc = NCOMP[t]
        bv = gltf["bufferViews"][acc["bufferView"]]
        start = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
        stride = bv.get("byteStride") or (CSIZE[ct] * nc)
        return [struct.unpack_from("<" + FMT[ct] * nc, bin_bytes, start + i * stride)
                for i in range(n)]

    def r(vecs, dec):
        flat = []
        for v in vecs:
            for x in v:
                flat.append(round(x, dec) + 0.0)  # +0.0 evita -0.0
        return flat

    names = [n.get("name") for n in gltf["nodes"]]
    if args.list:
        for i, n in enumerate(gltf["nodes"]):
            mi = n.get("mesh")
            mat = ""
            if mi is not None:
                p = gltf["meshes"][mi]["primitives"][0]
                mat = gltf["materials"][p["material"]]["name"]
            print(f"node[{i}] {n.get('name')} -> {mat}")
        return

    if args.mesh:
        ni = names.index(args.mesh)
        nodes = [gltf["nodes"][ni]]
    elif args.all:
        nodes = gltf["nodes"]
    else:
        print("use --all, --mesh <nome> ou --list"); sys.exit(1)

    meshes = {}
    order = []
    for node in nodes:
        name = node.get("name")
        prim = gltf["meshes"][node["mesh"]]["primitives"][0]
        mat_idx = prim.get("material")
        mat_name = gltf["materials"][mat_idx]["name"] if mat_idx is not None else None
        pos = read_accessor(prim["attributes"]["POSITION"])
        entry = {"material": mat_name}
        entry["position"] = r(pos, 6)
        if "NORMAL" in prim["attributes"]:
            entry["normal"] = r(read_accessor(prim["attributes"]["NORMAL"]), 3)
        if "TEXCOORD_0" in prim["attributes"]:
            entry["uv"] = r(read_accessor(prim["attributes"]["TEXCOORD_0"]), 4)
        if "COLOR_0" in prim["attributes"]:
            entry["color"] = r(read_accessor(prim["attributes"]["COLOR_0"]), 3)
        idx = read_accessor(prim["indices"])
        entry["index"] = [i for row in idx for i in row]
        mn = [min(v[k] for v in pos) for k in range(3)]
        mx = [max(v[k] for v in pos) for k in range(3)]
        entry["bounds"] = {"min": [round(x, 6) for x in mn], "max": [round(x, 6) for x in mx]}
        meshes[name] = entry
        order.append(name)

    out_obj = {"source": args.glb.split("/")[-1].split("\\")[-1], "units": "metres",
               "order": order, "meshes": meshes}
    out = args.out or (args.mesh or "geometria") + ".json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(out_obj, f, separators=(",", ":"))
    nv = sum(len(m["position"]) // 3 for m in meshes.values())
    import os
    print(f"OK: {out} — {len(meshes)} meshes, {nv} vertices, {os.path.getsize(out)/1e6:.1f} MB")

if __name__ == "__main__":
    main()
