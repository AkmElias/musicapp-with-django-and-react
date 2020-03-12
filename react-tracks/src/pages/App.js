import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import SearchTracks from "../components/Track/SearchTracks"
import TrackList from "../components/Track/TrackList"
import CreateTracks from "../components/Track/CreateTrack"
import Loading from '../components/Shared/Loading'
import Error from '../components/Shared/Error'

const App = ({ classes }) => {
  const [searchResults, setSearchResults] = useState([])
  return (
    <div className={classes.container}>
      <SearchTracks setSearchResults={setSearchResults} />
      <CreateTracks />
      <Query query={GET_TRACKS_QUERY}>
        {({ data, loading, error }) => {

          if (loading) return <Loading />
          if (error) return <Error />
          const tracks = searchResults.length > 0 ? searchResults : data.allTracks
          //console.log(tracks)
          //console.log({data})
          return <TrackList tracks={tracks} />
        }}
      </Query>
    </div>
  )
};

export const GET_TRACKS_QUERY = gql`

     query getTracksQuery{
       allTracks {
         id
         title
         description
         url
         likes {
           id
         }
         postedBy {
           id
           username
         }
       }
     }
`

const styles = theme => ({
  container: {
    margin: "0 auto",
    maxWidth: 960,
    padding: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(App);
