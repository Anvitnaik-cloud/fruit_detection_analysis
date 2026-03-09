# Generated from: fruits_Detection.ipynb
# Converted at: 2026-03-09T13:36:52.695Z
# Next step (optional): refactor into modules & generate tests with RunCell
# Quick start: pip install runcell

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

import os
for dirname, _,filenames in os.walk('/major porject/Fruits Classification'):
    for filename in filenames:
        print(os.path.join(dirname, filenames))

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Activation, Dropout, Flatten, Dense
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img

train_path = "major project/Fruits Classification/train/"
test_path = "major project/Fruits Classification/test/"

from tensorflow.keras.preprocessing.image import load_img
import matplotlib.pyplot as plt
img = load_img(train_path + "Mango/Mango (11).jpeg")
plt.imshow(img)
plt.axis("on")
plt.show()

img = img_to_array(img)
img.shape

model = Sequential()
model.add(Conv2D(128, 3, activation="relu", input_shape=(100,100,3)))
model.add(MaxPooling2D())
model.add(Conv2D(64, 3, activation="relu"))
model.add(Conv2D(32, 3, activation="relu"))
model.add(MaxPooling2D())
model.add(Dropout(0.50))
model.add(Flatten())
model.add(Dense(5000, activation="relu"))
model.add(Dense(1000, activation="relu"))
model.add(Dense(5, activation="softmax"))
model.summary()

model.compile(loss="categorical_crossentropy", optimizer = "SGD", metrics = ["accuracy"])


train_datagen = ImageDataGenerator(rescale = 1./255,
                  shear_range = 0.3,
                  horizontal_flip=True,
                  vertical_flip=False,
                  zoom_range = 0.3
                  )
test_datagen  = ImageDataGenerator(rescale = 1./255)

train_generator = train_datagen.flow_from_directory(train_path,
                                                    target_size=(100,100),
                                                    batch_size = 32,
                                                    color_mode= "rgb",
                                                    class_mode = "categorical")
test_generator = test_datagen.flow_from_directory(test_path,
                                                    target_size=(100,100),
                                                    batch_size = 32,
                                                    color_mode= "rgb",
                                                    class_mode = "categorical")

import tensorflow as tf
probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax()])

hist = model.fit(train_generator, 
                   steps_per_epoch = 50,
                   epochs = 50,
                   validation_data = test_generator,
                   validation_steps = 50)

from keras.models import load_model

model.save("Fruitmodel.h5")

import tensorflow as tf
probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax()])

test_generator.classes[99]

predictions = probability_model.predict(test_generator)

b=predictions[99]
print(b)

import numpy as np
np.argmax(b)

import os

folder = 'major project/Fruits Classification/test'

sub_folders = [name for name in os.listdir(folder) if os.path.isdir(os.path.join(folder, name))]

print(sub_folders[3])

print(train_generator.class_indices)

import random
print(random.choice(sub_folders))

print(sub_folders)