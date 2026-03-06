// keystatic.config.tsx
import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: process.env.NODE_ENV === 'development'
        ? { kind: 'local' }
        : {
            kind: 'github',
            repo: 'OoEthanoO/me'
        },
    collections: {
        posts: collection({
            label: 'Blog Posts',
            slugField: 'title',
            path: 'content/posts/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
                content: fields.document({
                    label: 'Content',
                    formatting: true,
                    dividers: true,
                    links: true,
                    images: {
                        directory: 'public/images/posts',
                        publicPath: '/images/posts/',
                    },
                }),
            },
        }),
        projects: collection({
            label: 'Projects',
            slugField: 'title',
            path: 'content/projects/*',
            format: { data: 'json' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                description: fields.text({ label: 'Description', multiline: true }),
                technologies: fields.array(fields.text({ label: 'Technology' }), {
                    label: 'Technologies',
                    itemLabel: props => props.value,
                }),
                collaborators: fields.array(
                    fields.object({
                        name: fields.text({ label: 'Name' }),
                        github: fields.url({ label: 'GitHub URL' }),
                    }),
                    {
                        label: 'Collaborators',
                        itemLabel: props => props.fields.name.value,
                    }
                ),
                github: fields.url({ label: 'GitHub URL' }),
                website: fields.url({ label: 'Website URL' }),
                images: fields.array(
                    fields.image({
                        label: 'Image',
                        directory: 'public/images/projects',
                        publicPath: '/images/projects/',
                    }),
                    {
                        label: 'Images',
                        itemLabel: props => props.value ? 'Image' : 'No image selected'
                    }
                ),
                status: fields.text({ label: 'Status' }),
            },
        }),
    },
});
