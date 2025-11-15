/**
 * Base interface for all use cases in the application layer.
 * Use cases encapsulate single units of business logic and orchestrate
 * interactions between domain entities, repositories, and other services.
 *
 * @template TInput - The input DTO/parameters for the use case
 * @template TOutput - The return type of the use case execution
 */
export interface IUseCase<TInput = void, TOutput = void> {
  /**
   * Executes the use case with the given input.
   *
   * @param input - The input parameters for the use case
   * @returns A promise that resolves to the use case output
   */
  execute(input: TInput): Promise<TOutput>;
}
