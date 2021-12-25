import keras
from keras.regularizers import l2


# 这些单词都属于max_words中的单词，输入维度
maxlen = 100
# 输出维度
embedding_dim = 128

class TextClassify(keras.Model):
    # 构造函数
    def __init__(self, words):
        super(TextClassify, self).__init__()
        # 特征单词数，一个句子的总词语数
        max_words = words
        self.input_layer = keras.layers.Input(maxlen,)
        self.embedding = keras.layers.Embedding(max_words, embedding_dim, input_length=maxlen,)
        #第二层
        #指定过滤器个数/卷积核的大小
        #卷积核其实应该是一个二维的，这里只需要指定一维，是因为卷积核的第二维与输入的词向量维度是一致的，因为对于句子而言，卷积的移动方向只能是沿着词的方向，即只能在列维度移动
        #在这里kernalsize=一次提取几个词的特征
        self.conv1 = keras.layers.Conv1D(filters=256, kernel_size=2, strides=1, padding='valid', activation='relu')
        self.pool1 = keras.layers.MaxPool1D(48)
        self.conv2 = keras.layers.Conv1D(filters=256, kernel_size=3, strides=1, padding='valid', activation='relu')
        self.pool2 = keras.layers.MaxPool1D(47)
        self.conv3 = keras.layers.Conv1D(filters=256, kernel_size=4, strides=1, padding='valid', activation='relu')
        self.pool3 = keras.layers.MaxPool1D(46)
        self.flat = keras.layers.Flatten()
        self.drop = keras.layers.Dropout(0.2)
        self.dense = keras.layers.Dense(units=7, activation='softmax', kernel_regularizer=l2(0.02))
        self.out = self.call(self.input_layer)

    def call(self, inputs, training=None, mask=None):
        input = self.embedding(inputs)
        conv1 = self.conv1(input)
        pool1 = self.pool1(conv1)
        conv2 = self.conv2(inputs)
        pool2 = self.pool2(conv2)
        conv3 = self.conv3(inputs)
        pool3 = self.pool3(conv3)
        cont = keras.layers.concatenate(pool1, pool2, pool3)
        flat1 = self.flat()(cont)
        drop = self.drop()(flat1)
        dense = self.dense(drop)
        return dense


