import PIL
from PIL import Image

# newSize = width, height will be the same
def resize(imageName, newSize):
    image = Image.open(imageName)
    percentWidth = (newSize / float(image.size[0]))
    newHeight = int((float(image.size[1]) * float(percentWidth)))
    return image.resize((newSize, newHeight), PIL.Image.ANTIALIAS)
def resizeSave(imageName, newSize, newImageName):
    resize(imageName, newSize).save(newImageName)
def getSize(image):
    return image.size
def getSizeW(image):
    return getSize(image)[0]
def open(imageName):
    return Image.open(imageName)
def resizeLoop(imageName, newSize):
    baseSize = getSizeW(open(imageName))
    while baseSize > 4:
        resize(imageName, baseSize)
        baseSize /= 2
