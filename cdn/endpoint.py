from flask import Flask, render_template, request, send_file
from flask_uploads import UploadSet, configure_uploads, IMAGES
import images as image_mgr

app = Flask(__name__)

photos = UploadSet('photos', IMAGES)

app.config['UPLOADED_PHOTOS_DEST'] = 'original_images'
configure_uploads(app, photos)

@app.route('/upload', methods=['POST', 'GET'])
def upload():
    if request.method == 'POST' and 'photo' in request.files:
        photos.save(request.files['photo'])
@app.route('/get_image', methods=['GET'])
def get_image():
    image_mgr.resize_save('original_images\\' + request.args.get('name'), int(request.args.get('size')), 'tempimage.png')
    return send_file('tempimage.jpeg', mimetype='image/*')

if(__name__ == '__main__'):
    app.run(debug=False)