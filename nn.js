const INPUTS = 5;
const HIDDEN = 8;
const OUTPUTS = 2;
const mutation = 0.1;

class NeuralNetwork {
  constructor(nn) {
    if (nn instanceof tf.Sequential) {
      this.model = nn;
    } else {
      this.model = NeuralNetwork.createModel();
    }
  }

  dispose() {
    this.model.dispose();
  }

  save() {
    this.model.save("downloads://duck-brain");
  }

  predict(input_array) {
    return tf.tidy(() => {
      let xs = tf.tensor([input_array]);
      let ys = this.model.predict(xs);
      let y_values = ys.dataSync();
      return y_values;
    });
  }

  static createModel() {
    // Tworzę model sekwencyjny
    const model = tf.sequential();
    // Tworzę warstwę ukrytą na podstawie wejść
    let hidden = tf.layers.dense({
      inputShape: [INPUTS],
      units: HIDDEN,
      activation: "sigmoid",
    });
    let output = tf.layers.dense({
      units: OUTPUTS,
      activation: "softmax",
    });
    model.add(hidden);
    model.add(output);
    return model;
  }

  // Funkcja kopiująca
  copy() {
    return tf.tidy(() => {
      const modelCopy = NeuralNetwork.createModel();
      const w = this.model.getWeights();
      for (let i = 0; i < w.length; i++) {
        w[i] = w[i].clone();
      }
      modelCopy.setWeights(w);
      return new NeuralNetwork(modelCopy);
    });
  }

  mutate(func) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      for (let i = 0; i < weights.length; i++) {
        const tensor = weights[i];
        const shape = tensor.shape;
        const values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; j++) {
          values[j] = func(values[j]);
        }
        let newW = tf.tensor(values, shape);
        weights[i] = newW;
      }
      this.model.setWeights(weights);
    });
  }
}
function mutateWeight(x) {
  if (random(1) < mutation) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}
