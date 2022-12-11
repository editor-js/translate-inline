from flask import Flask, request, jsonify
from flask_cors import CORS

from googletrans import Translator

app = Flask(__name__)
CORS(app)
translator = Translator()

@app.route('/translate', methods=['GET'])
def hello():
    try:
        text = request.args.get('text', default = None)
        landSrc = request.args.get('src', default = None)
        langDest = request.args.get('dest', default = 'en')
        
        response = translator.translate(text, dest=langDest).text
        
        return jsonify({
            "status": "success",
            "message": response
        }) 

    except Exception as err:
        print(err)
        return jsonify({
            "status": "error",
            "message": str(err)
        })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)