import math
import cmath
import numpy as np
import sys

red = 1
blue = math.e**(math.pi * 2j / 3)
green = math.e**(-math.pi * 2j / 3)

tiles = 8

for a in sys.argv:
	p = a.find("=")
	if p > 0 and p < len(a) - 1:
		arg = a[0:p]
		val = a[p + 1:]
		if arg == "t":
			tiles = int(val)

colors = []

def addcol(c):
	for x in colors:
		if(abs(x - c) < 0.01):
			return
	colors.append(c)

sqrtNeeded = []

def addsqrt(n):
	for x in sqrtNeeded:
		if x == n:
			return
	sqrtNeeded.append(n)

#for r in range(1 + tiles):
#	for g in range(1 + tiles - r):
#		for b in range(1 + tiles - r - g):
#			col = red * r + green * g + blue * b
#			addcol(col)
for r in range(1 + tiles):
	for g in range(1 + tiles - r):
		if r + g <= tiles:
			col = red * r + green * g
			addcol(col)

for i in range(len(colors)):
	c = colors[i]
	num_abs = round(abs(c)**2)
	sq = math.sqrt(num_abs)
	if sq == int(sq):
		#print("A " + str(sq))
		pass
	else:
		#print("B " + str(num_abs))
		addsqrt(num_abs)
	colors[i] = [num_abs, cmath.phase(c) * 180 / math.pi]

sqrtNeeded.sort()

print(sqrtNeeded)
print(len(sqrtNeeded))

#for i in sqrtNeeded:
#	print("template/num_sqrt_" + str(i) + ".png")
