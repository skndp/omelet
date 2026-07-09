import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'seoSocial',
  title: 'SEO / Social Sharing',
  type: 'object',
  description: 'Preview at: https://www.opengraph.xyz',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title for search engines and social sharing previews',
      validation: Rule =>
        Rule.max(70).warning('Long titles may be truncated or rewritten in search results.')
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'For search engines and social media sharing previews',
      validation: [
        Rule => Rule.max(160).warning('Descriptions should ideally be 120 to 160 characters. Long descriptions may be truncated or rewritten in search results.')
      ]
    }),
    defineField({
      name: 'image',
      title: 'Social Sharing Image',
      type: 'image',
      description: 'For search engines and social media sharing previews (Best at 1200 × 630)',
    })
  ]
});
