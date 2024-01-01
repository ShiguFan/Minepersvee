import math
import cmath
import numpy as np
import sys
from PIL import Image

ground = Image.open("../Ground.png").convert("RGBA").split()
ground_R = np.array(ground[0])
ground_G = np.array(ground[1])
ground_B = np.array(ground[2])

ground_X = (0.299 * (ground_R/255)**2 + 0.587 * (ground_G/255)**2 + 0.114 * (ground_B/255)**2) ** 0.5 * 255
ground_X *= 0.98

def makeImg(i, grayScale=True):
	number = Image.open("num_" + i + ".png").convert("RGBA").split()
	alpha = np.array(number[3]) / 255.0
	num_R = np.array(number[0])
	num_G = np.array(number[1])
	num_B = np.array(number[2])

	tile_R = np.uint8(ground_R + (num_R - ground_R) * alpha)
	tile_G = np.uint8(ground_G + (num_G - ground_G) * alpha)
	tile_B = np.uint8(ground_B + (num_B - ground_B) * alpha)
	
	data = np.array([tile_R, tile_G, tile_B]).transpose((1, 2, 0))
	img = Image.fromarray(data, 'RGB')

	img.save("../numbers/num_" + i + ".png")

	if grayScale:
		tile_X = np.uint8(ground_X + (120 - ground_X) * alpha)
		data = np.array([tile_X, tile_X, tile_X]).transpose((1, 2, 0))
		img = Image.fromarray(data, 'RGB')
		img.save("../grayscale/num_" + i + ".png")

for i in range(25):
	makeImg(str(i))

for i in range(12):
	makeImg("negative_" + str(i + 1))

for i in ["epsilon", "frac_1_2", "frac_1_3", "frac_1_4", "frac_1_8", "frac_2_3", "frac_3_4", "frac_7_8"]:
	makeImg(i, grayScale=False)

data = np.uint8(np.array([ground_X, ground_X, ground_X]).transpose((1, 2, 0)))
img = Image.fromarray(data, 'RGB')
img.save("../grayscale/Ground.png")
