import { Metadata } from 'next';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Creating metadata dynamically based on the id supplied
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  // Get the id from our URL params
  const resolvedParams = await params;
  const id =  resolvedParams.id;

  // Accessing the params and search params
  // in the page's metadata
  console.log('generateMetadata: params', params);
  console.log('generateMetadata: searchParams', searchParams);
  // Logs:
  // generateMetadata: params { id: '1' }
  // generateMetadata: searchParams {}

  // Fetch the data
  const response = await fetch(`${API_URL}/${id}`);
  const post = await response.json();

  // Set the `title` of the document to the id and title
  // of the post that was fetched
  // that was fetched
  return {
    title: `${id} - ${post.title}`,
  };
}

export default async function Post({ params, searchParams }: Props) {
  // We can access "params" and "searchParams" in our page.tsx file
  const { id } = await params;
  return (
    <div>
      <h1>Post: {id}</h1>
      {/*
        Logs:
          page.tsx: params { id: '1' }
          page.tsx: searchParams {}
      */}
    </div>
  );
}
