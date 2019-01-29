import Component from '@ember/component'
import { service } from 'ember-decorators/service'
import { task } from 'ember-concurrency'
import { filterBy } from 'ember-decorators/object/computed'
import { later } from '@ember/runloop'

export default class NotesViewComponent extends Component {
  @service store
  @service router
  @service currentContent
  @service lecturePlayer
  @service youtubePlayer

  @filterBy('runAttempt.notes', 'isNew', false) savedNotes

  requestErrored = false

  addNoteTask = task(function * () {
    const contentId = this.get('currentContent').getContentId()
    const store = this.get('store')

    const content = store.peekRecord('content', contentId)
    let duration ;
    switch (content.get('contentable')) {
      case 'lecture':  duration = this.get('lecturePlayer').getCurrentTime(); break;
      case 'video': duration = this.get('youtubePlayer').getCurrentTime(); break;
      default: duration = 0
    }

    const note = store.createRecord('note', {
      text: this.get('newNoteText'),
      runAttempt: this.get('runAttempt'),
      content,
      duration
    })

    try {
      yield note.save()
      this.set('newNoteText', '')
    } catch (err) {
      console.error(err)
      this.set('requestErrored', true)
      later(() => this.set("requestErrored", false), 1000)
    }
  })
}
