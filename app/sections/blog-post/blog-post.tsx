import {useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {Article} from '@shopify/hydrogen/storefront-api-types';
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import {forwardRef} from 'react';

import {Section} from '~/components/Text';

interface BlogPostProps extends HydrogenComponentProps {
  paddingTop: number;
  paddingBottom: number;
}

let BlogPost = forwardRef<HTMLElement, BlogPostProps>((props, ref) => {
  let {paddingTop, paddingBottom, ...rest} = props;
  let {article, formattedDate} = useLoaderData<{
    article: Article;
    formattedDate: string;
  }>();
  let {title, image, contentHtml, author, tags} = article;
  if (article) {
    return (
      <section ref={ref} {...rest} className='h-fit'>
        <div
          style={{
            paddingTop: `${paddingTop}px`,
            paddingBottom: `${paddingBottom}px`,
          }}
          className='flex flex-col h-fit'
        >
          <div className="h-full flex flex-col">
            {image && (
              <Image
                data={image}
                className="w-full h-[720px] object-cover"
              />
            )}
            <div className="w-full h-full flex items-center pt-16 flex-col gap-4">
              <h5 className='py-1 px-4 bg-label-new text-white rounded'>Product guidelines</h5>
              <h1 className="font-bold">{title}</h1>
            </div>
          </div>
          <Section as="article" padding="all">
            <div className="lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 mx-auto space-y-8 md:space-y-16">
              <div dangerouslySetInnerHTML={{__html: contentHtml}} />
              <p className="font-semibold opacity-45 text-foreground-subtle mt-9">{formattedDate}</p>
            </div>
          </Section>
        </div>
      </section>
    );
  }
  return <section ref={ref} {...rest} />;
});

export default BlogPost;

export let schema: HydrogenComponentSchema = {
  type: 'blog-post',
  title: 'Blog post',
  limit: 1,
  enabledOn: {
    pages: ['ARTICLE'],
  },
  toolbar: ['general-settings'],
  inspector: [
    {
      group: 'Blog post',
      inputs: [
        {
          type: 'range',
          label: 'Top padding',
          name: 'paddingTop',
          configs: {
            min: 0,
            max: 100,
            step: 4,
            unit: 'px',
          },
          defaultValue: 0,
        },
        {
          type: 'range',
          label: 'Bottom padding',
          name: 'paddingBottom',
          configs: {
            min: 0,
            max: 100,
            step: 4,
            unit: 'px',
          },
          defaultValue: 0,
        },
      ],
    },
  ],
};
