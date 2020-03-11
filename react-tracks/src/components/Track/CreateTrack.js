import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Mutation } from "react-apollo"
import { gql } from "apollo-boost"
import axios from 'axios'
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { Input } from "@material-ui/core";

import { GET_TRACKS_QUERY } from '../../pages/App'
import Loading from '../Shared/Loading'
import Error from '../Shared/Error'

const CreateTrack = ({ classes }) => {

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [fileError, setFileError] = useState("")

  const handaleAudioChange = event => {
    const selectedFile = event.target.files[0]
    const fileSizeLimit = 1000000
    if(selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError(`${selectedFile.name}: File size too large`)
    } else {
      setFile(selectedFile)
      setFileError('')
    }
    
  }

  const handleAudioUpload = async () => {
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('resource_type', 'raw')
      data.append('upload_preset', 'musicapp-react-tracks')
      data.append('cloud_name', 'akmelias')
      const res = await axios.post('https://api.cloudinary.com/v1_1/akmelias/raw/upload', data)
      return res.data.url
    } catch (err) {
      console.error("Error uploading track", err)
      setSubmitting(false)
    }

  }

  const handleSubmit = async (event, createTrack) => {
    event.preventDefault()
    setSubmitting(true)
    const audioUploadedUrl = await handleAudioUpload()
    createTrack({ variables: { title, description, url: audioUploadedUrl } })
  }

  return (
    <>
      {/* create track button */}
      <Button onClick={() => setOpen(true)} variant="fab" className={classes.fab} color="secondary">
        {open ? <ClearIcon /> : <AddIcon />}
      </Button>
      <Mutation mutation={CREATE_TRACK_MUTATION}
        onCompleted={data => {
          console.log({ data })
          setSubmitting(false)
          setOpen(false)
          setTitle("")
          setDescription("")
          setFile("")
        }}

        refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
      >
        {(createTrack, { loading, error }) => {

          if (error) return <Error error={error} />
          return (
            <Dialog open={open} className={classes.dialog}>
              <form onSubmit={event => handleSubmit(event, createTrack)}>
                <DialogTitle> Create Track </DialogTitle>
                <DialogContent>
                  <DialogContentText>Add a title , description & a Audio File </DialogContentText>
                  <form>
                    <FormControl fullWidth>
                      <TextField
                        label="Title"
                        placeholder="Add Title"
                        className={classes.textField}
                        value = {title}
                        onChange={event => setTitle(event.target.value)}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <TextField
                        multiline
                        row="4"
                        label="Description"
                        placeholder="Add description"
                        className={classes.textField}
                        onChange={event => setDescription(event.target.value)}
                        value = {description}
                      />
                    </FormControl>
                    <FormControl fullWidth error={fileError}>
                      <Input
                        required
                        id="audio"
                        type="file"
                        inputProps={{ accept: 'audio/*' }}
                        className={classes.input}
                        onChange={handaleAudioChange}
                      />
                      <label htmlFor="audio">
                        <Button variant="outlined" color={file ? "secondary" : "inherit"} component="span" className={classes.button}>
                          Audio file
                        <LibraryMusicIcon className={classes.icon} />
                        </Button>
                        {file && file.name}
                        <FormHelperText>{fileError}</FormHelperText>
                      </label>
                    </FormControl>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button disabled={submitting} onClick={() => setOpen(false)} className={classes.cancel}>
                    cancel
                  </Button>
                  <Button type="submit" className={classes.save}
                    disabled={submitting || !title.trim() || !description.trim() || !file}
                  >
                    {submitting ? (
                      <CircularProgress size={24} className={classes.save} />
                    ) : (
                        "Add Track"
                      )}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          )
        }}
      </Mutation>
      {/* create track dialog */}

    </>
  )
};

const CREATE_TRACK_MUTATION = gql`

   mutation ($title: String!, $description: String!, $url: String!){
     createTrack(title: $title, description: $description, url: $url) {
       track{
         id
         title
         description
         url
       }
     }
   }
`

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550
  },
  textField: {
    margin: theme.spacing.unit
  },
  cancel: {
    color: "red"
  },
  save: {
    color: "green"
  },
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  }
});

export default withStyles(styles)(CreateTrack);
