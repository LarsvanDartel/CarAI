function sigmoid(x){
    return 1/(1+Math.exp(x));
}

function tangenth(x){
    return Math.tanh(x);
}

function addRandom(x){
    if(Math.random() > learningRate){
        return x + random(-learningRate, learningRate);
    }
    return x;
}

class NeuralNetwork{
    constructor(numI, hiddenArr, numO){
        this.input_nodes = numI;
        this.hidden_layers = hiddenArr.length;
        this.hidden_nodes = [];
        for(let i = 0; i < this.hidden_layers; i++){
            this.hidden_nodes.push(hiddenArr[i]);
        }
        this.output_nodes = numO;
        this.hidden_weights = [];
        for(let i = 0; i < this.hidden_layers; i++){
            if(i == 0){
                this.hidden_weights[i] = new Matrix(this.hidden_nodes[i], this.input_nodes);
            } else {
                this.hidden_weights[i] = new Matrix(this.hidden_nodes[i], this.hidden_nodes[i-1]);
            }
        }
        
        this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes[this.hidden_layers-1]);
        for(let weightMatrix of this.hidden_weights){
            weightMatrix.randomize();
        }
        this.weights_ho.randomize();
        this.bias_h = [];
        for(let i = 0; i < this.hidden_layers; i++){
            this.bias_h[i] = new Matrix(this.hidden_nodes[i], 1);
        }
        this.bias_o = new Matrix(this.output_nodes, 1);
        for(let i = 0; i < this.hidden_layers; i++){
            this.bias_h[i].randomize();
        }
        this.bias_o.randomize();
    }

    copy(){
        let result = new NeuralNetwork(this.input_nodes, this.hidden_nodes, this.output_nodes);
        for(let i = 0; i < this.hidden_layers; i++){
            result.bias_h[i] = this.bias_h[i].copy();
            result.hidden_weights[i] = this.hidden_weights[i].copy();
        }
        result.bias_o = this.bias_o.copy();
        result.weights_ho = this.weights_ho.copy();
        return result;
    }

    randomizeAgain(){
        for(let weightMatrix of this.hidden_weights){
            weightMatrix.map(addRandom);
        }
        this.weights_ho.map(addRandom);
        for(let hiddenBias of this.bias_h){
            this.bias_h.map(addRandom);
        }
        this.bias_o.map(addRandom);
    }

    feedForward(input){
        let inputMatrix = Matrix.fromArray(input);
        for(let i = 0; i < this.hidden_layers; i++){
            inputMatrix = Matrix.multiply(this.hidden_weights[i], inputMatrix);
            // inputMatrix.add(this.bias_h[i]);
            inputMatrix.map(tangenth);
        }
        let output = Matrix.multiply(this.weights_ho, inputMatrix);
        // output.add(this.bias_o);
        output.map(tangenth);
        return output.toArray();
    }
}