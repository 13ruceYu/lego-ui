import { pick } from 'lodash'
import { computed } from 'vue'
import type { TextComponentProps } from '@/constants/defaultProps'

export default function useComponentCommon(props: Readonly<Partial<TextComponentProps>>, picks: string[]) {
  const styleProps = computed(() => pick(props, picks))
  const handleClick = () => {
    if (props.actionType === 'url' && props.url) {
      window.location.href = props.url
    }
  }
  return {
    styleProps,
    handleClick
  }
}
