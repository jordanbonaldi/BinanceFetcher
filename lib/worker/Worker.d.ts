export default abstract class Worker {
    private readonly name;
    private delay;
    private params;
    /**
     *
     * @param name
     * @param delay
     * @param params
     */
    protected constructor(name: string, delay: number, params?: {});
    abstract run<T>(params: object): Promise<T>;
    protected load<T>(params?: object, perm?: boolean): Promise<T>;
}
