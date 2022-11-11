import os
import shutil

from allosaurus.app import read_recognizer

from databases import Database


class AudioProcessor:
    def __init__(self):
        # load model
        self.model = read_recognizer()

    def get_tokens(self, file_path):
        # run inference
        tokens = self.model.recognize(file_path)

        # delete the temporary file
        os.remove(file_path)

        # return the tokens
        return tokens

    @staticmethod
    def write_file_to_directory(uploaded_file):
        file_location = f'/tmp/{uploaded_file.filename}'
        with open(file_location, 'wb+') as file_object:
            shutil.copyfileobj(uploaded_file.file, file_object)

        return file_location
