class Matrix{
    constructor(nRows, nCols){
        this.rows = nRows;
        this.cols = nCols;
        this.matrix = [];
        for(let i = 0; i < this.rows; i++){
            this.matrix[i] = [];
            for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] = 0;
            }
        }
    }

    copy(){
        let result = new Matrix(this.rows, this.cols);
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                result.matrix[i][j] = this.matrix[i][j];
            }
        }
        return result;
    }

    toArray(){
        let arr = [];
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                arr.push(this.matrix[i][j]);
            }
        }
        return arr;
    }
    
    set(i, j, val){
        this.matrix[i][j] = val;
    }

    static from2dArray(arr){
        let result = new Matrix(arr.length, arr[0].length);
        for(let i = 0; i < arr.length; i++){
            for(let j = 0; j < arr[i].length; j++){
                result.set(i, j, arr[i][j]);
            }
        }
        return result;
    }

    static fromArray(arr){
        let result = new Matrix(arr.length, 1);
        for(let i = 0; i < arr.length; i++){
            result.set(i, 0, arr[i]);
        }
        return result;
    }
    transpose(){
        let result = new Matrix(this.cols, this.rows);
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                result.matrix[j][i] = this.matrix[i][j];
            }
        }
        return result;
    }
    randomize(){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] = random(-1, 1);
            }
        }
    
    }
    print(){
        console.table(this.matrix);
    }
    static multiply(a, b){
        if(a.cols !== b.rows){
            return undefined;
        }
        let result = new Matrix(a.rows, b.cols);
        for(let i = 0; i < result.rows; i++){
            for(let j = 0; j < result.cols; j++){
                let sum = 0;
                for(let k = 0; k < a.cols; k++){
                    sum += a.matrix[i][k] * b.matrix[k][j];
                }
                result.matrix[i][j] = sum;
            }
        }
        return result;
    }
    mul(n){
        if(n instanceof Matrix){
            for(let i = 0; i < this.rows; i++){
                for(let j = 0; j < this.cols; j++){
                    this.matrix[i][j] *= n.matrix[i][j];
                }
            }
        }
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] *= n;
            }
        }
    }
    add(n){
        if(n instanceof Matrix){
            for(let i = 0; i < this.rows; i++){
                for(let j = 0; j < this.cols; j++){
                    this.matrix[i][j] += n.matrix[i][j];
                }
            }
            return;
        }
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] += n;
            }
        }
    }

    map(f){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] = f(this.matrix[i][j]);
            }
        }
    }

    sub(n){
        if(n instanceof Matrix){
            for(let i = 0; i < this.rows; i++){
                for(let j = 0; j < this.cols; j++){
                    this.matrix[i][j] -= n.matrix[i][j];
                }
            }
            return;
        }
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] -= n;
            }
        }
    }
    div(n){
        if(n instanceof Matrix){
            for(let i = 0; i < this.rows; i++){
                for(let j = 0; j < this.cols; j++){
                    this.matrix[i][j] /= n.matrix[i][j];
                }
            }
            return;
        }
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] /= n;
            }
        }
    }
}