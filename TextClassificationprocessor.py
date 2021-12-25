import numpy as np
from matplotlib import pyplot as plt
import pandas as pd
from sklearn.metrics import classification_report

from TextClassificationCNN import *
from TextClassificationGRU import *
from TextClassificationLSTM import *
from keras.preprocessing.text import Tokenizer
from keras_preprocessing.sequence import pad_sequences

# 特征单词数
max_words = 0
# 这些单词都属于max_words中的单词，输入维度
maxlen = 100

batch_size = 20


def CNN(X,Y,test_X,test_Y,max_words):
    model = TextClassify(max_words)
    model.compile(optimizer="SGD",
                  loss="categorical_crossentropy",
                  metrics=['categorical_accuracy']
                  )
    history = model.fit(
        X,
        Y,
        batch_size=batch_size,
        epochs=50,
        validation_data=(test_X, test_Y)
    )
    # model.summary()
    score = model.evaluate(test_X, test_Y, verbose=0)
    print(score[1])
    return history, model

def GRU(X,Y,test_X,test_Y,max_words):
    model = TextClassfyGRU(3,max_words)
    model.compile(optimizer="SGD",
                  loss="categorical_crossentropy",
                  metrics=['categorical_accuracy']
                  )
    history = model.fit(
        X,
        Y,
        batch_size=batch_size,
        epochs=50,
        validation_data=(test_X, test_Y)
    )
    # model.summary()
    score = model.evaluate(test_X, test_Y, verbose=0)
    print(score[1])
    return history,model

def LSTM(X,Y,test_X,test_Y,max_words):
    model = TextClassfyLSTM(3, max_words)
    model.compile(optimizer="SGD",
                  loss="categorical_crossentropy",
                  metrics=['categorical_accuracy']
                  )
    history = model.fit(
        X,
        Y,
        batch_size=batch_size,
        epochs=50,
        validation_data=(test_X, test_Y)
    )
    # model.summary()
    score = model.evaluate(test_X, test_Y, verbose=0)
    print(score[1])
    return history,model


def tokenized(dataframe):
    # 1、对句子进行分词
    tokenizer = Tokenizer(num_words=max_words)
    tokenizer.fit_on_texts(dataframe)
    vocab = len(tokenizer.word_index)+1
    train_X = tokenizer.texts_to_sequences(dataframe)
    # 2、填充
    train_X = pad_sequences(train_X, maxlen=maxlen)
    return train_X, vocab

if __name__ == '__main__':
    # 数据预处理
    raw_data = pd.read_csv('data/train.csv/train.csv')
    fresh_data = raw_data[['discourse_text', 'discourse_type']]
    #先拿部分进行实验
    train_data = fresh_data.iloc[0:2000, :]
    train_Y = pd.get_dummies(train_data.discourse_type)
    train_X, train_words = tokenized(train_data['discourse_text'])
    #测试集
    test_data = fresh_data.iloc[2001:3061, :]
    test_Y = pd.get_dummies(test_data.discourse_type)
    test_X, test_words = tokenized(test_data['discourse_text'])
    #print(test_Y.values)
    #试验数据
    experiment_data = fresh_data.iloc[3062:4062, :]
    experiment_Y = pd.get_dummies(experiment_data.discourse_type)
    experiment_X, experiment_words = tokenized(experiment_data['discourse_text'])
    max_words = train_words+test_words+experiment_words

    #建立模型
    history, model = LSTM(train_X, train_Y, test_X, test_Y, max_words)
    # predicted_Y = model.predict(experiment_X)
    # #model.summary()
    #
    # #可视化函数
    # for i in range(len(predicted_Y)):
    #     max_value = max(predicted_Y[i])
    #     for j in range(len(predicted_Y[i])):
    #         if max_value == predicted_Y[i][j]:
    #             predicted_Y[i][j] = 1
    #         else:
    #             predicted_Y[i][j] = 0
    # print(classification_report(experiment_Y, predicted_Y))
    #
    # #数据展示
    # acc = history.history['categorical_accuracy']  # 训练集准确率
    # val_acc = history.history['val_categorical_accuracy']  # 测试集准确率
    # loss = history.history['loss']  # 训练集损失
    # val_loss = history.history['val_loss']  # 测试集损失
    # plt.subplot(1,2,1)
    # plt.plot(acc, label='Training Accuracy')
    # plt.plot(val_acc, label='Validation Accuracy')
    # plt.title('Training and Validation Accuracy')
    # plt.legend()
    # loss = history.history['loss']
    # val_loss = history.history['val_loss']
    # plt.subplot(1,2,2)
    # plt.plot(loss, label='Training Loss')
    # plt.plot(val_loss, label='Validation Loss')
    # plt.title('Training and Validation Loss')
    # plt.legend()
    # #plt.show()


