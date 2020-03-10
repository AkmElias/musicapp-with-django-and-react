import React from "react";
import withRoot from "./withRoot";
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

const Root = () => (
    <Query query={ME_QUERY}>

        {({ data, error, loading }) => {
            if (loading) return <div>Loading</div>
            if (error) return <div>Error</div>

            return <div>{JSON.stringify(data)}</div>
        }}

    </Query>
);

const ME_QUERY = gql`
   {
       me{
           id
           username
           email
       }
   }
`

// const GET_TRACKS_QUERY = gql`
//   {
//       allTracks{
//           id
//           title
//           description
//           url
//       }
//   }

//`

export default withRoot(Root);
