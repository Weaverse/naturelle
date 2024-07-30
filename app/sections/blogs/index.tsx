import {Image} from '@shopify/hydrogen';
import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
  WeaverseBlog,
} from '@weaverse/hydrogen';
import {IconImageBlank} from '~/components/Icon';
import {Link} from '~/components/Link';
import {BLOG_QUERY} from '~/data/queries';
import clsx from 'clsx';
import {CSSProperties, forwardRef} from 'react';

type BlogData = {
  blogs: WeaverseBlog;
  backgroundColor: string;
  articlePerRow: number;
  showSeperator: boolean;
};

type BlogProps = HydrogenComponentProps<Awaited<ReturnType<typeof loader>>> &
  BlogData;

let articlesPerRowClasses: {[item: number]: string} = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
};

const Blogs = forwardRef<HTMLElement, BlogProps>((props, ref) => {
  let {
    blogs,
    backgroundColor,
    articlePerRow,
    showSeperator,
    loaderData,
    children,
    ...rest
  } = props;

  let sectionStyle: CSSProperties = {
    '--background-color': backgroundColor,
  } as CSSProperties;

  const defaultArticles = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    title: 'Trendy items for this Winter Fall 2025 season',
    excerpt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: null,
    handle: null,
  }));

  const res = loaderData?.blog?.articles.nodes ?? defaultArticles;
  
  return (
    <section
      ref={ref}
      {...rest}
      className="flex h-full w-full justify-center bg-[var(--background-color)]"
      style={sectionStyle}
    >
      <div className="container flex flex-col gap-6 px-4 py-12 sm:px-6 sm:py-20">
        {children}
        <div
          className={clsx(
            'flex flex-col gap-9 sm:grid sm:gap-0 sm:justify-self-center',
            articlesPerRowClasses[Math.min(articlePerRow, res?.length || 1)],
          )}
        >
          {res?.map((idx, i) => (
            <Link
              key={i}
              to={idx.handle ? `/blogs/${blogs.handle}/${idx.handle}` : '#'}
              className={'group'}
            >
              <div
                key={idx.id}
                className="flex w-full cursor-pointer flex-col items-center gap-4 rounded p-0 transition-colors duration-500 group-hover:bg-background-subtle-1 sm:p-6"
              >
                {idx.image ? (
                  <Image
                    data={idx.image}
                    sizes="auto"
                    className="!aspect-square !w-full rounded object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-background-subtle-1">
                    <IconImageBlank
                      viewBox="0 0 526 526"
                      className="h-full w-full opacity-80"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-4">
                <h3 className="group-hover:underline">{idx.title}</h3>
                  {showSeperator && (
                    <div className="w-full border-b border-bar-subtle"></div>
                  )}
                  <p className="line-clamp-3">
                    {idx.excerpt}
                  </p>
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
  let {weaverse, data} = args;
  let {storefront, request} = weaverse;
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
          type: 'blog',
          name: 'blogs',
          label: 'Blog',
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
          defaultValue: 3,
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
  childTypes: ['heading'],
  presets: {
    children: [
      {
        type: 'heading',
        content: 'Blogs',
      },
    ],
  },
};
