import {MaskitoDateMode, maskitoDateOptionsGenerator} from '@maskito/kit';
import { parseISO } from 'date-fns';

const maskDatetime = (options: {format: string, separator: string, min: string, max: string}) => {
    const mode = options.format.toLowerCase() as MaskitoDateMode;
    const min  = options.min ? parseISO(options.min) : undefined;
    const max  = options.max ? parseISO(options.max) : undefined;
    return maskitoDateOptionsGenerator({mode: mode, separator: options.separator || '/', max: max, min: min});
}

export default maskDatetime;