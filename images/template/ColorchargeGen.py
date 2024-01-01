import math
import cmath
import numpy as np
import sys
from PIL import Image

red = 1
blue = math.e**(math.pi * 2j / 3)
green = math.e**(-math.pi * 2j / 3)

tiles = 8
gammaInv = 1.0 / 2.2

for a in sys.argv:
	p = a.find("=")
	if p > 0 and p < len(a) - 1:
		arg = a[0:p]
		val = a[p + 1:]
		if arg == "t":
			tiles = int(val)
		if arg == "g":
			gammaInv = 1.0 / float(val)

colors = []

def addcol(c):
	for x in colors:
		if(abs(x - c) < 0.01):
			return
	colors.append(c)

for r in range(1 + tiles):
	for g in range(1 + tiles - r):
		for b in range(1 + tiles - r - g):
			col = red * r + green * g + blue * b
			addcol(col)

for i in range(len(colors)):
	c = colors[i]
	num_abs = round(abs(c)**2)
	sq = math.sqrt(num_abs)
	txt = "num_"
	if sq == int(sq):
		txt += str(int(sq))
	else:
		txt += "sqrt_" + str(num_abs)
	colors[i] = [txt, cmath.phase(c) * 180 / math.pi]

def colorMix(n):
	return n ** gammaInv, (1 - n) ** gammaInv
 
def phaseToHex(phase):
	if phase < 0:
		phase += 360
	r = 0
	g = 0
	b = 0
	if phase < 120:
		b, r = colorMix(phase / 120)
	elif phase < 240:
		g, b = colorMix(phase / 120 - 1)
	else:
		r, g = colorMix(phase / 120 - 2)
	return [r, g, b]

ground = Image.open("../Ground.png").convert("RGBA").split()
ground_R = np.array(ground[0])
ground_G = np.array(ground[1])
ground_B = np.array(ground[2])

def mix(g, h, a):
	#res = g + (h * 255 - g) * a
	res = g.copy()
	res[a > 0.5] = h  * 255
	res[res < 0] = 0
	res[res > 255] = 255
	return res.astype(np.uint8)

for c in colors:
	h = phaseToHex(c[1])
	if c[0] == "num_0":
		h = [0.2, 0.2, 0.2]
	target = c[0] + "__" + str(int((c[1] + 360) % 360)) + ".png"
	print(c[0] + " in " + str(h) + " as " + target)
	number = Image.open(c[0] + ".png").convert("RGBA")
	alpha = np.array(number.split()[3]) / 255.0

	tile_R = mix(ground_R, h[0], alpha)
	tile_G = mix(ground_G, h[1], alpha)
	tile_B = mix(ground_B, h[2], alpha)
	
	data = np.array([tile_R, tile_G, tile_B]).transpose((1, 2, 0))
	img = Image.fromarray(data, 'RGB')

	img.save("../colorcharge/" + target)
