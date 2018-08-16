from flask import Flask, render_template, request, send_file
from flask_uploads import UploadSet, configure_uploads, IMAGES
import images as imageMgr

app = Flask(__name__)

photos = UploadSet('photos', IMAGES)

app.config['UPLOADED_PHOTOS_DEST'] = 'original_images'
configure_uploads(app, photos)

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST' and 'photo' in request.files:
        filename = photos.save(request.files['photo'])
        return filename
    return render_template('upload.html')
@app.route('/get_image', methods=['GET'])
def get_image():
    imageMgr.resizeSave('original_images\\' + request.args.get('name'), int(request.args.get('size')), 'tempimage.png')
    return send_file('tempimage.jpeg', mimetype='image/gif')
@app.route('/')
def index():
    return '/upload -> upload meme, emoji, some hentai... | /get_image?name=imgname&size=imagesize -> get image with given size'

if(__name__ == '__main__'):
    app.run(debug=True)