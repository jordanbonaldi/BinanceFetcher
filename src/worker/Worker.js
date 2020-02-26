class Worker {

    constructor(name, delay, params = {}) {
        this._name = name;
        this._delay = delay;
        this._params = params;
        console.log(this._name + " running");
    }

    /**
     *
     * @returns {null | Promise<*>}
     */
    run(params = {}) {
        return null;
    }

    load(params = {}, perm = true) {
        if (params !== {})
            this._params = params;
        if (!perm)
            return this.run(this._params);

        return this.run(this._params).then(() => {
            return new Promise((res) => setTimeout(res, this._delay * 1000))
                .then(() => this.load(this._params))
                .catch((e) => {
                    console.log("Trying to handle error and rebuild " + this._name + `: ${e}`);
                    return new Promise((res) => setTimeout(res, 240 * 1000))
                        .then(() => {
                            console.log("Error handled with success and system rebuilt");
                            return this.load(this._params)
                        })
                });
        });
    }

}

module.exports = Worker;