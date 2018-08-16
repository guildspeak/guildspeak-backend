import PIL
from PIL import Image

# newSize = width, height will be the same
def resize(image_name, new_size):
    image = Image.open(image_name)
    percent_width = (new_size / float(image.size[0]))
    new_height = int((float(image.size[1]) * float(percent_width)))
    return image.resize((new_size, new_height), PIL.Image.ANTIALIAS)
def resize_save(image_name, new_size, new_image_name):
    resize(image_name, new_size).save(new_image_name)
def get_size(image):
    return image.size
def get_size_w(image):
    return get_size(image)[0]
def open(image_name):
    return Image.open(image_name)
def resize_loop(image_name):
    baseSize = get_size_w(open(image_name))
    while baseSize > 4:
        resize(image_name, baseSize)
        baseSize /= 2
