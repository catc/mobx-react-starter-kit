# Modal component

## Usage
Usage is simple - just import the modal wrapper decorator and use it on your component

```tsx
// wrapping a component with a modal
import modal from 'components/common/modal/modal-wrapper'

@modal(OpenModalOptions)
@observer
export default class YourComponent extends Component {
	componentDidMount(){
		this.props.showContent(OpenModalOptions)
	}
	render(){
		return (
			<div>
				This component is now a modal!
			</div>
		)
	}
}

// using your component
import YourComponent from 'src/your-component

@observer
export default class SomeView extends Component {
	@observable displayModal = false;
	openModal(val){
		this.displayModal = val
	}
	render(){
		return (
			<div>
				<button onClick={() => this.displayModal = true}>Open Modal</button>

				{this.displayModal ?
					<YourComponent
						// pass in function to remove component from view after it closes
						close={() => this.dipslayModal = false}
					/>
					:
					null
				}
			</div>
		)
	}
} 
```

Displaying the modal can be done in 2 ways:
- using the decorator options - this is useful if you don't need to wait on fetching content before displaying the modal
	- must pass in `autoShow: true` along with any other options
```tsx
@modalWrapper({
	autoShow: true,
	center: true // any other options
})
@observer
export default class YourComponent extends Component {
	render(){
		return (
			<div>any content</div>
		)
	}
}
```

- calling `this.props.showContent` - this is useful if you want to fetch data, render it and then display the modal with it's rendered content
```tsx
@modalWrapper({})
@observer
export default class YourComponent extends Component {
	componentDidMount(){
        this.props.showContent({
            center: true
        })
    }
	render(){
		return (
			<div>any content</div>
		)
	}
}
```

----------------------

## Modal options

#### `autoshow` - boolean (default: `false`)
**Only usable with decorator options - not `this.props.showContent`**

#### `animation` - string (default: `'scale-fade-in'`)
Type of animation to use. Options are:
```
'scale-fade-in' 	// default
'fade-in'
'fade-drop-in'
```

#### `center` - bool (default: `true`)
Centers the modal vertically

#### `contentWrapperClass` - string (default: `''`)
The class you wish to pass to the `.modal-dialog` element
	- useful for setting styles such as:
		- `max-width`
		- `margin` - setting `margin-left/right: auto` will center it
		- `padding` - setting padding on top/bottom/left/right for small viewports

#### `disableRouteChangeClose` - boolean (default: `false`)
Disables automatically closing the modal when the route changes. Note that this option will have no effect if the modal is a child of a route that becomes unmounted when route changes.

#### `modalDidClose` - `() => void`
A function the wrapped component can pass to the modal decorator that is called after the modal performs a close animation. Useful for performing any actions on the wrapped component before removing modal from dom.


## Wrapped Component Props
The wrapped component props are:

#### `showContent`: `(OpenModalOptions) => void`
Displays modal content (makes it visible)

#### `closeModal`: `() => void`
Animates the modal closing and then calls 
