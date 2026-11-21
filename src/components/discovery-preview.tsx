'use client';
import {useState} from 'react';
import {Search} from 'lucide-react';
import {posts} from '@/data/posts';
import {PostCard} from './post-card';
export function DiscoveryPreview({searchable}:{searchable:boolean}){const [query,setQuery]=useState('');const filtered=posts.filter(post=>`${post.title} ${post.story} ${post.category}`.toLowerCase().includes(query.toLowerCase()));return <>{searchable&&<label className="search-field"><Search size={19}/><input aria-label="Search community posts" placeholder="Search bakes, recipes, little discoveries…" value={query} onChange={event=>setQuery(event.target.value)}/></label>}<div className="posts-grid">{filtered.map(post=><PostCard key={post.id} post={post}/>)}</div>{!filtered.length&&<p className="empty-state" role="status">No crumbs here yet. Try “cake”, “bakery”, or “buns”.</p>}</>}
