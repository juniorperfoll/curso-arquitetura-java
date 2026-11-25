import pathlib
root = pathlib.Path(__file__).parent
content = "\n".join((root/'content'/n).read_text() for n in ['f0_paths.js','f1.js','f2.js','f3.js','f4.js','f5.js','f6.js','f7.js','f8_vscode.js','f9_extras_a.js','f9_extras_b.js','f9_extras_c.js'])
html = (root/'template.html').read_text().replace('/*CONTENT*/', content)
(root/'site').mkdir(exist_ok=True)
(root/'site'/'index.html').write_text(html)
print(len(html))
