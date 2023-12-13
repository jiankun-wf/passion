export interface UseSortableReturn {
  /**
   * start sortable instance
   */
  start: () => void;
  /**
   * destroy sortable instance
   */
  stop: () => void;
}
export type UseSortableOptions = Options & ConfigurableDocument;
export declare function useSortable<T>(
  selector: string,
  list: MaybeRefOrGetter<T[]>,
  options?: UseSortableOptions,
): UseSortableReturn;
export declare function useSortable<T>(
  el: MaybeRefOrGetter<HTMLElement | null | undefined>,
  list: MaybeRefOrGetter<T[]>,
  options?: UseSortableOptions,
): UseSortableReturn;
export declare function moveArrayElement<T>(
  list: MaybeRefOrGetter<T[]>,
  from: number,
  to: number,
): void;
