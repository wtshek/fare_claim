import { shallowMount } from '@vue/test-utils'
import SyncNotification from '../../components/notificationBox'

describe('Sync Notifications', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(SyncNotification, {
      propsData: {
        message: 'Syncing Data',
        show: false,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.props().message).toBe('Syncing Data')
    expect(wrapper.props().show).toBe(false)
  })
})
