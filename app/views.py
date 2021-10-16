from django.shortcuts import render
from django.views import View
import base64
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
import string
import random
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
from .srgan import sr_resnet
from .common import resolve_single
import os

gan_generator = sr_resnet()
gan_generator.load_weights('app/models/gan_generator.h5')


def load_image(path):
    return Image.open(path)
# Create your views here.


class SRView(View):
    def get(self, request):
        return render(request, 'index.html')


@api_view(['POST'])
def _post(request):
    f = request.FILES['value']
    file_name = 'storage/'+''.join(random.choice(
        string.ascii_uppercase + string.digits) for _ in range(10))+'.png'

    default_storage.save(file_name, f)

    img = load_image(file_name)
    img = img.resize((124, 118))
    img = np.array(img)
    gan_sr = resolve_single(gan_generator, img)
    plt.imsave(file_name, gan_sr.numpy())

    with open(file_name, 'rb') as f:
        my_string = base64.b64encode(f.read())
    os.remove(file_name)
    return Response(data={'data': my_string}, status=status.HTTP_200_OK)
