import React from 'react';

function getRelatedProviders(element, providers) {
  if (React.isValidElement(element)) {
    const childType = element && element.type;
    const props = { ...element.props };

    if (providers[childType]) {
      const params = providers[childType](element);
      if (params) {
        Object.assign(props, params);
      } else {
        return null; // Remove element
      }
    }

    if (element.props.children) {
      if (Array.isArray(element.props.children)) {
        return React.cloneElement(element, {
          ...props,
          children: React.Children.map(element.props.children, (children) =>
            getRelatedProviders(children, providers)
          ),
        });
      }
      return React.cloneElement(element, { ...props, children: getRelatedProviders(element.props.children, providers) });
    }

    return React.cloneElement(element, { ...props });
  }

  return element;
}

function createDataProviders(elements, providers) {
  return React.Children.map(elements, (child) =>
    getRelatedProviders(child, providers)
  );
}

export default createDataProviders;
