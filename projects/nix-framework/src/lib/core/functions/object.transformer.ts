export function getValue(path: string, obj: any): any {
  return path.split('.').reduce((acc, part) => {
    const match = part.match(/^(\w+)\[(\d+)]$/);
    if (match) {
      const [, prop, index] = match;
      return acc && acc[prop] && acc[prop][Number(index)];
    }
    
    return acc && acc[part];
  }, obj);
}

export function transformValue(subject: string, data: any): any {
  // const regex = /\${(.*?)}/g;
  const matches = subject.match(/\$\{(.+?)\}/);
  if (matches && matches[1]) {
      return getValue(matches[1], data);
  }

  return subject;
}

export function transformObject(obj: any, data: any): any {
  const result: any = {};

  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result[key] = transformValue(obj[key], data) || '';
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}