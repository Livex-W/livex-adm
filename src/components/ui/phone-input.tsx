import 'react-international-phone/style.css';
import { PhoneInput as ReactPhoneInput, PhoneInputProps as ReactPhoneInputProps } from 'react-international-phone';
import { cn } from '@/lib/utils';

export interface PhoneInputProps extends Omit<ReactPhoneInputProps, 'onChange'> {
    label?: string;
    error?: string;
    helperText?: string;
    onChange?: (phone: string) => void;
    className?: string;
}

function PhoneInput({
    className,
    label,
    error,
    helperText,
    onChange,
    value,
    ...props
}: PhoneInputProps) {
    return (
        <div className={cn("w-full", className)}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <ReactPhoneInput
                    defaultCountry="co"
                    value={value}
                    onChange={(phone) => onChange?.(phone)}
                    className="flex w-full"
                    inputClassName={cn(
                        `
                        !w-full !h-11 px-4 py-2.5 rounded-lg rounded-l-none
                        bg-white dark:bg-slate-900
                        border border-slate-300 dark:border-slate-700 border-l-0
                        text-slate-900 dark:text-slate-100
                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        disabled:cursor-not-allowed 
                        disabled:bg-slate-100 disabled:text-slate-500 
                        dark:disabled:bg-slate-800/50 dark:disabled:text-slate-400
                        font-sans text-base
                        !ml-0
                        `,
                        error && '!border-red-500 focus:!ring-red-500'
                    )}
                    countrySelectorStyleProps={{
                        buttonClassName: cn(
                            `
                            !h-11 !px-3 rounded-lg rounded-r-none
                            bg-white dark:bg-slate-900
                            border border-slate-300 dark:border-slate-700 border-r-0
                            text-slate-900 dark:text-slate-100
                            hover:bg-slate-50 dark:hover:bg-slate-800
                            transition-colors duration-200
                            `,
                            error && '!border-red-500'
                        ),
                        dropdownStyleProps: {
                            className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg overflow-hidden",
                            listItemClassName: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 cursor-pointer transition-colors"
                        }
                    }}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    {helperText}
                </p>
            )}
        </div>
    );
}

export { PhoneInput };
