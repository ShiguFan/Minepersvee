import base64
data = {}

with open("textureList", "r") as f:
	for l in f.readlines():
		name = l.rstrip("\n");
		img = open(name, "rb");
		b64 = base64.encodebytes(img.read()).decode("ascii").replace("\n", "")
		data[name] = b64

commonStart = False
for name in data.keys():
	if name.find(".png") != -1:
		if commonStart == False:
			commonStart = data[name]
		else:
			while data[name].find(commonStart) == -1:
				commonStart = commonStart[:-1]

print(commonStart)
			

with open("../js/b64.js", "w") as f:
	f.write("var b64 = {\nprefix:\"data:image/png;base64,"+commonStart+"\",\n");
	for key in data.keys():
		b64 = data[key][len(commonStart):].replace("AAAA","!").replace("AAA", "$").replace("AA", "%").replace("I$CQkWg2$B", "_").replace("Y!f8/9h", "&")
		if(key.endswith(".png")):
			key = key[:-4]
		print(key)
		f.write("\"" + key + "\":\"" + b64 + "\",\n")
	f.write("};\n");

