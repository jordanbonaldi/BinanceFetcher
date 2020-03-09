export default abstract class Worker {

    private readonly name: string;
    private delay: number;
    private params: {};

    /**
     *
     * @param name
     * @param delay
     * @param params
     */
    protected constructor(name: string, delay: number, params: {} = {}) {
        this.name = name;
        this.delay = delay;
        this.params = params;

        console.log(this.name + " running");
    }

    abstract run<T>(params: object): Promise<T>;

    protected load<T>(params: object = {}, perm: boolean = true): Promise<T> {
        if (params !== {})
            this.params = params;
        if (!perm)
            return this.run<T>(this.params);

        return this.run<T>(this.params).then(() => {
            return new Promise<T>((res: any) => setTimeout(res, this.delay * 1000))
                .then(() => this.load<T>(this.params))
                .catch((e) => {
                    console.log("Trying to handle error and rebuild " + this.name + `: ${e}`);
                    return new Promise<T>((res: any) => setTimeout(res, 240 * 1000))
                        .then(() => {
                            console.log("Error handled with success and system rebuilt");
                            return this.load<T>(this.params)
                        })
                });
        });
    }

}