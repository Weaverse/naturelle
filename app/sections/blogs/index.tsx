import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
    ComponentLoaderArgs,
    WeaverseBlog
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';
import { Image } from '@shopify/hydrogen';
import { IconImageBlank } from '~/components/Icon';
import { BLOG_QUERY } from '~/data/queries';
import { Link } from '~/components/Link';
import clsx from 'clsx';

type BlogData = {
    blogs: WeaverseBlog;
    heading: string;
    backgroundColor: string;
    articlePerRow: number;
    showSeperator: boolean;
};

type BlogProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    BlogData;

let articlesPerRowClasses: { [item: number]: string } = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
};

const Blogs = forwardRef<HTMLElement, BlogProps>((props, ref) => {
    let {
        blogs,
        heading,
        backgroundColor,
        articlePerRow,
        showSeperator,
        loaderData,
        ...rest
    } = props;


    let sectionStyle: CSSProperties = {
        '--background-color': backgroundColor,
    } as CSSProperties;

    if (loaderData === undefined) {
        return (
            <section ref={ref} {...rest} className="w-full h-full bg-[var(--background-color)]" style={sectionStyle}>
                <div className="px-4 pt-12 flex flex-col gap-6 sm:px-6 sm:py-20">
                    {heading && <div className="flex justify-center">
                        <h2 className="font-medium">{heading}</h2>
                    </div>}
                    <div className="flex flex-col sm:grid sm:justify-self-center gap-5 sm:gap-0 grid-cols-3">
                        <div
                            className='flex flex-col gap-4 items-center w-full p-0 sm:p-6'
                        >
                            <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                <IconImageBlank
                                    viewBox="0 0 526 526"
                                    className="w-full h-full opacity-80"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className='font-medium'>Trendy items for this Winter Fall 2025 season</h3>
                                <div className="border-b-2 border-gray-300 w-full"></div>
                                <p className='font-normal'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                            </div>
                        </div>
                        <div
                            className='flex flex-col gap-4 items-center w-full p-0 sm:p-6'
                        >
                            <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                <IconImageBlank
                                    viewBox="0 0 526 526"
                                    className="w-full h-full opacity-80"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className='font-medium'>Trendy items for this Winter Fall 2025 season</h3>
                                <div className="border-b-2 border-gray-300 w-full"></div>
                                <p className='font-normal'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                            </div>
                        </div>
                        <div
                            className='flex flex-col gap-4 items-center w-full p-0 sm:p-6'
                        >
                            <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                <IconImageBlank
                                    viewBox="0 0 526 526"
                                    className="w-full h-full opacity-80"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className='font-medium'>Trendy items for this Winter Fall 2025 season</h3>
                                <div className="border-b-2 border-gray-300 w-full"></div>
                                <p className='font-normal'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    let res = loaderData?.blog?.articles.nodes;
    const truncateText = (content: any, maxLength: number) => {
        if (content.length > maxLength) {
            return content.slice(0, maxLength) + '...';
        }
        return content;
    };
    return (
        <section ref={ref} {...rest} className="h-full w-full flex justify-center bg-[var(--background-color)]" style={sectionStyle}>
            <div className="px-4 pt-12 flex flex-col gap-6 sm:px-6 sm:py-20 max-w-[1440px]">
                {heading && <div className="flex justify-center">
                    <h2 className="font-medium">{heading}</h2>
                </div>}
                <div className={clsx(
                    "flex flex-col sm:grid sm:justify-self-center gap-5 sm:gap-0",
                    articlesPerRowClasses[Math.min(articlePerRow, res?.length || 1)]
                )}>
                    {res?.map((idx: any) => (
                        <Link to={`/blogs/${blogs.handle}/${idx.handle}`} className={'group'}>
                            <div key={idx.id}
                                className='flex flex-col gap-4 items-center w-full p-0 sm:p-6 group-hover:bg-background-subtle-1 transition-colors duration-500 rounded cursor-pointer'
                            >
                                {idx.image ? (
                                    <Image
                                        data={idx.image}
                                        sizes="auto"
                                        className="!w-full !aspect-square object-cover rounded"
                                    />) : (
                                    <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                        <IconImageBlank
                                            viewBox="0 0 526 526"
                                            className="w-full h-full opacity-80"
                                        />
                                    </div>)}
                                <div className="flex flex-col gap-4">
                                    <h3 className='group-hover:underline'>{idx.title}</h3>
                                    {showSeperator && <div className="border-b-2 border-bar-subtle w-full"></div>}
                                    <div dangerouslySetInnerHTML={{ __html: truncateText(idx.contentHtml, 150) }}></div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
});

export default Blogs;

export let loader = async (args: ComponentLoaderArgs<BlogData>) => {
    let { weaverse, data } = args;
    let { storefront, request } = weaverse;
    if (data.blogs) {
        const res = await storefront.query(BLOG_QUERY, {
            variables: {
                blogHandle: data.blogs.handle,
            },
        });
        return res;
    }
};

export const schema: HydrogenComponentSchema = {
    type: 'blogs',
    title: 'Blogs',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'Blogs',
            inputs: [
                {
                    type: "blog",
                    name: "blogs",
                    label: "Blog",
                },
                {
                    type: 'text',
                    name: 'heading',
                    label: 'Heading',
                    defaultValue: 'Blogs',
                    placeholder: 'Heading text',
                },
                {
                    type: 'color',
                    label: 'Background color',
                    name: 'backgroundColor',
                    defaultValue: '#F8F8F0',
                },
                {
                    type: 'range',
                    name: 'articlePerRow',
                    label: 'Articles per row',
                    defaultValue: 2,
                    configs: {
                        min: 1,
                        max: 4,
                        step: 1,
                    },
                },
                {
                    type: 'switch',
                    name: 'showSeperator',
                    label: 'Seperator',
                    defaultValue: true,
                },
            ],
        },
    ],
};