export type StatusResponse<T> = { status: number; body: T };

export type Handler<TInput = void, TOutput = any> = (
  input: TInput
) => Promise<StatusResponse<TOutput>> | StatusResponse<TOutput>;

export type HandlersMap = Record<string, Handler<any, any>>;

type ExtractInput<T extends Handler> = T extends (input: infer I) => any
  ? I
  : never;
type ExtractResponse<T extends Handler> = Awaited<ReturnType<T>>;

export type ClientFromHandlers<T extends HandlersMap> = {
  [K in keyof T]: ExtractInput<T[K]> extends void
    ? () => Promise<ExtractResponse<T[K]>>
    : (input: ExtractInput<T[K]>) => Promise<ExtractResponse<T[K]>>;
};

export class TypedRouter<THandlers extends HandlersMap> {
  private handlers: THandlers;

  constructor(handlers: THandlers) {
    this.handlers = handlers;
  }

  createClient(): ClientFromHandlers<THandlers> {
    const client = {} as ClientFromHandlers<THandlers>;

    for (const key in this.handlers) {
      const handler = this.handlers[key];

      client[key] = (async (input?: any) => {
        return await handler(input);
      }) as any;
    }

    return client;
  }

  getHandlers() {
    return this.handlers;
  }
}
