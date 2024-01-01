from PIL import Image
import math
import sys

b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

def lSort(codes):
	codes.sort(key = lambda x : x[len(x) - 1])

def compress(arr):
	l = len(arr)
	pos = 0
	sym = []
	while pos < l:
		j = max(0, pos - 256)
		maxLen = 2
		maxStart = 0
		while j < pos:
			c = 0
			#print(str(pos + c) + " " + str(j + c))
			while pos + c < l and arr[pos + c] == arr[j + c] and c < 258:
				c += 1
			if c > maxLen:
				maxLen = c
				maxStart = j
			j += 1
		if maxLen >= 3:
			sym.append("r" + str(pos - maxStart - 1) + "," + str(maxLen - 3))
			pos += maxLen
		else:
			sym.append(str(arr[pos]))
			pos += 1
	#print(sym)
	#print(len(sym) / len(arr))
	frequencies = {}
	for s in sym:
		if s in frequencies:
			frequencies[s] += 1
		else:
			frequencies[s] = 1
	#print(frequencies)
	codes = []
	for k in frequencies:
		codes.append(["l", k, frequencies[k]])
	lSort(codes)
	while(len(codes) > 1):
		a = codes[0]
		b = codes[1]
		codes.pop(1)
		codes[0] = ["b", a, b, a[len(a) - 1] + b[len(b) - 1]]
		lSort(codes)
	res = ""
	def addNum(n):
		nonlocal res
		#res += "("
		n = int(n)
		i = 128
		while i > 0:
			res += "1" if (n & i != 0) else "0"
			i //= 2
		#res += ")"

	def createCodes(code, prefix):
		nonlocal res
		if code[0] == "b":
			res += "1"
			createCodes(code[1], prefix + "0")
			createCodes(code[2], prefix + "1")
		else:
			res += "0"
			s = code[1]
			frequencies[s] = prefix
			if s[0] == "r":
				res += "1"
				t = s[1:].split(",")
				addNum(t[0])
				addNum(t[1])
			else:
				res += "0"
				addNum(s)
			
	createCodes(codes[0], "")
	for s in sym:
		res += frequencies[s]
	m = len(res) % 6
	if m != 0:
		res += "0" * (6 - m)
	res64 = ""
	
	for i in range(len(res) // 6):
		s = res[i * 6: i * 6 + 6]
		n = 0
		for j in range(6):
			n *= 2
			if s[j] == "1":
				n += 1
		res64 += b64[n]

	#print(codes[0])
	#print(frequencies)
	#print(res)
	print(res64)
	print()
		
def translateBoard(img):
	im = Image.open(img)
	x, y = im.size
	pix = im.load()
	arr = []
	filled = 0
	for i in range(x):
		for j in range(y):
			if len(pix[i, j]) == 3:
				r,g,b = pix[i, j]
			else:
				r,g,b,a = pix[i, j]
			if r == 255 and g == 0 and b == 0:
				arr.append(0)
			else:
				arr.append(max(1, r))
				filled += 1
	print(img + "\n\tX = " + str(x) + "\n\tY = " + str(y) + "\n\tT = " + str(filled) + " (" + str(int(filled * 100 / (x * y))) + "%)")
	#print(arr)
	compress(arr)

for i in range(1, len(sys.argv)):
	translateBoard(sys.argv[i])

