import keras

# 特征单词数，一个句子的总词语数
max_words = 25000
# 这些单词都属于max_words中的单词，输入维度
maxlen = 100
# 输出维度
embedding_dim = 64

class TextClassfyLSTM(keras.Model):

    def __init__(self, units,words):
        super(TextClassfyLSTM, self).__init__()

        self.units = units
        # 特征单词数，一个句子的总词语数
        max_words = words
        self.embedding = keras.layers.Embedding(max_words, embedding_dim, input_length=maxlen)

        self.lstm = keras.layers.Bidirectional(keras.layers.LSTM(self.units))

        self.dense = keras.layers.Dense(7, activation='softmax')

    def call(self, x, training=None, mask=None):
        x = self.embedding(x)
        x = self.lstm(x)
        x = self.dense(x)

        return x
