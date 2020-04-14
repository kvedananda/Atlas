import { DEFAULT_COMPONENT_COLOR_CODES } from '../constants';
export const createComponent = ({
  id = null,
  type = null,
  name = null,
  description = null,
  options = {},
  tooltip = [],
  color = null,
  data = null,
}) => {
  return {
    id,
    type,
    name,
    description,
    options,
    tooltip,
    color: color || DEFAULT_COMPONENT_COLOR_CODES[type],
    data,
  };
};
