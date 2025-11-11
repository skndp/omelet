import { defineField, defineType } from 'sanity';
import { TextIcon } from '@sanity/icons';
// Sanity Icon Set: https://icons.sanity.build/all

export default defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      description: 'Left = narrower, left-align text. Center = wider, centered text.',
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" }
        ],
        layout: "radio",
        direction: "horizontal"
      },
      initialValue: 'left'
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'text',
      rows: 2,
      description: 'A headline with align: left will automatically split this text block into 2 columns. A headline with align: center will stack.'
    }),
    defineField({
      name: 'rule',
      title: 'Horizontal Rule',
      description: 'Add a horizontal rule under the title?',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.alignment !== "center",
    }),
    defineField({
      name: 'richtext',
      title: 'Copy',
      type: 'array',
      of: [{
        type: 'block',
        styles: [],
        lists: [],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' }
          ],
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'External link',
              fields: [
                {
                  name: 'href',
                  type: 'url',
                  title: 'URL',
                  validation: Rule => Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel']
                  })
                }
              ]
            }
          ]
        }
      }]
    })
  ]
});
