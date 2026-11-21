import Link from 'next/link';
import { Wheat } from 'lucide-react';
export function Brand() { return <Link href="/" className="brand" aria-label="Crumb Club home"><Wheat size={28} strokeWidth={1.5}/><span>Crumb Club<span className="brand-dot">✳</span></span></Link>; }
