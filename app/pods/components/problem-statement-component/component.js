import Component from '@ember/component';
import { computed }  from '@ember/object';
import config from 'codingblocks-online/config/environment'

export default Component.extend({
  classNames: ['height-100'],
  editorialLink: computed('hbProblemId', 'contestId', function () {
    const contestId = this.get('contestId')
    const problemId = this.get('problemId')
    return `${config.hbBaseUrl}/contests/c/${contestId}/${problemId}/editorial`
  })
});
