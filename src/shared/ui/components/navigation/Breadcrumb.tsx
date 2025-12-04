import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface Props {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: Props) {
    return (
        <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && <FiChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
                    {item.href ? (
                        <Link 
                            href={item.href} 
                            className="hover:text-blue-600 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
