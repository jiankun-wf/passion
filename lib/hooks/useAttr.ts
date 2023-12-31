import { getCurrentInstance, shallowRef, reactive, watchEffect } from "vue";
import type { Ref } from "vue";
interface Params {
  excludeListeners?: boolean;
  excludeKeys?: string[];
  excludeDefaultKeys?: boolean;
}

const DEFAULT_EXCLUDE_KEYS = ["class", "style"];
const LISTENER_PREFIX = /^on[A-Z]/;

export function entries<T>(obj: Record<string, T>): [string, T][] {
  return Object.keys(obj).map((key: string) => [key, obj[key]]);
}
export function useAttrs(params: Params = {}): Ref<Record<string, any>> | {} {
  const instance = getCurrentInstance();
  if (!instance) return {};

  const {
    excludeListeners = false,
    excludeKeys = [],
    excludeDefaultKeys = true,
  } = params;
  const attrs = shallowRef({});
  const allExcludeKeys = excludeKeys.concat(
    excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : []
  );

  // Since attrs are not reactive, make it reactive instead of doing in `onUpdated` hook for better performance
  instance.attrs = reactive(instance.attrs);

  watchEffect(() => {
    const res = entries(instance.attrs).reduce((acm, [key, val]) => {
      if (
        !allExcludeKeys.includes(key) &&
        !(excludeListeners && LISTENER_PREFIX.test(key))
      ) {
        acm[key] = val;
      }

      return acm;
    }, {} as Record<string, any>);

    attrs.value = res;
  });

  return attrs;
}
