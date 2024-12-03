import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import  Add_Blog_To_MySQL_DB  from '@/lib/mySQL/client_side/PUT/Add_Blog_To_MYSQL_DB'
import userAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { useState } from 'react'
const Main_Form = () => {

  const router = useRouter()
  const [user, isPending] = userAuth();
  const [error,setError] = useState(Error)

    //Makes a formSchema that will called in the next code block to actually create the form object
    //We use zod to set the rules for the form input fields.
    const formSchema = z.object({
        blog_title: z.string().min(2).max(50),
        comment_settings_default: z.union([z.literal("comments allowed"),z.literal("comments must be approved"),z.literal('comments disabled')]),
        blog_template_style: z.union([z.literal("Simple Blog"),z.literal("Detailed Blog"),z.literal("Silly Blog")]),
        blog_description: z.string().min(2).max(100).optional(),
    })
    
    //when the values of the form are used as parameters in another function, the params need to know
    //their type. This is why we define the type for the formSchema.
    type FormSchemaType = z.infer<typeof formSchema>;

    //Uses react hook form with a zod schema to create a form that has
    //default values and validation rules based on the zod schema formSchema
    //useForm is setting up the form, and it is given the type of the formSchema defined above
    const form = useForm<z.infer<typeof formSchema>>({
        //the resolver keyword allows react-hook-form to integrate with external validation
        //libraries, like zod. Setting this resolver allows zod to validate the form using formSchema
        resolver: zodResolver(formSchema),
        defaultValues: {
            blog_title: "",
            comment_settings_default: "comments allowed",
            blog_template_style: "Simple Blog",
            blog_description: ""
          },
    })

    //The input for this function will be the returned values of the form, which are wrapped in an object of type FormSchemaType
    async function onSubmit(values: FormSchemaType) {
        //We are first going to make a POST request to the mySQL DB to add the blog post
        //Then, in the event that is successful, we will route to the blog view, with URL parameters so that the recieving
        //component knows which blog to display

        /* DB REQUEST */
        //We call a client function that makes the API call
        try {
          if(user?.email){
            const idToken = await user.getIdToken(true);
            let comment_settings;
            if(values.comment_settings_default === 'comments allowed') {
              comment_settings = 0
            } else if (values.comment_settings_default === 'comments must be approved') {
              comment_settings = 1
            } else if(values.comment_settings_default === 'comments disabled'){
              comment_settings = 2
            } else {
              throw new Error('comment settings are different than expected. cannot create blog')
            }
            const blog_add_response = await Add_Blog_To_MySQL_DB(idToken,values.blog_title,comment_settings,values.blog_template_style)
            //The client middleware returns an error  if it runs into any problems
            if(blog_add_response.success === null) {
              throw new Error('The client middleware "Add_Blog_To_MySQL_DB" encountered a critical error')
            }
            if(blog_add_response.success === true) {
              console.log("Blog Add Response:",blog_add_response)
              //This is where we route to the dashboard
              const query = new URLSearchParams({
                blog_id: blog_add_response.res.insertId
                //comment_settings_default: values.comment_settings_default,
              }).toString()
      
              console.log(values)
              router.push(`/dashboard?${query}`)

            } else if(blog_add_response.errno === 1062) {
              throw new Error("The blog title must be unique")
            } else if(blog_add_response.errno === 1406) {
              throw new Error("One or more fields exceed maximum length.")
            } else {
              throw new Error(blog_add_response.message)
            }
          } else {
            throw new Error("user's session information could not be captured, so blog creation could not complete")
          }
        } catch(error) {
          if(error instanceof Error)
            setError(error)
        }
      }

    return ( <div>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
    <FormField
        //This control prop links this particular form field to the zod validation we set up and attached to the form object
        control={form.control}
        name="blog_title"
        //the field object contains properties like value,onChange,and onBlur (onBlur means onExit, when you click out of a form field)
        //setting render equal to field gives the children components the necessary methods to connect the input to the form's state (idk it doesn't make sense, where did this random keyword come from??)
        render={({ field }) => (
        <FormItem>
            <FormLabel>Blog Title</FormLabel>
            <FormControl>
                {/* This uses the spread syntax. The spread syntax extracts the contents of an interable
                object and makes key/value pairs. In this case, the key value pairs are the objects inside the form prop,
                which include key properties like value, onChange, onBlur, etc.
                Spreading the field here sets these properties to the same properties of the Input field. 
                It is a shorthand that makes the component automatically bound to the form’s state and validation*/}
                <Input {...field} placeholder="Enter Blog Title" />
            </FormControl>
            <FormDescription>Enter a title for your blog post.</FormDescription>
        </FormItem>
        )}
    />
    <FormField
        //This control prop links this particular form field to the zod validation we set up and attached to the form object
        control={form.control}
        name="blog_description"
        render={({ field }) => (
        <FormItem>
            <FormLabel>Blog Description</FormLabel>
            <FormControl>
                {/* This uses the spread syntax. The spread syntax extracts the contents of an interable
                object and makes key/value pairs. In this case, the key value pairs are the objects inside the form prop,
                which include key properties like value, onChange, onBlur, etc.
                Spreading the field here sets these properties to the same properties of the Input field. 
                It is a shorthand that makes the component automatically bound to the form’s state and validation*/}
                <Input {...field} placeholder="Enter Blog Description" />
            </FormControl>
            <FormDescription>Enter a description for your blog. This is optional.</FormDescription>
        </FormItem>
        )}
    />
    {/* Comment Settings Dropdown */}
    <FormField
              control={form.control}
              name="comment_settings_default"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment Settings</FormLabel>
                  <FormControl>
                    {/* This prop connects the select input to react-hook-form. It makes sure the 
                    form state is change accordingly when the field is changed. It says sets a default value from the defined default value above */}
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select comment settings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comments allowed">Comments Allowed</SelectItem>
                        <SelectItem value="comments must be approved">Comments Must Be Approved</SelectItem>
                        <SelectItem value="comments disabled">Comments Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select the default comment settings for your blog.</FormDescription>
                  {/* Below component displays errors in the event form rules are not satisfied, or confirmation message*/}
                  <FormMessage />
                </FormItem>
              )}
            />
    {/* Blog Template Style Dropdown */}
    <FormField
              control={form.control}
              name="blog_template_style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Template Style</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Simple Blog">Simple Blog</SelectItem>
                        <SelectItem value="Detailed Blog">Detailed Blog</SelectItem>
                        <SelectItem value="Silly Blog">Silly Blog</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Choose a style template for your blog.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
    {/* Submit Button */}
    <Button type="submit">Submit</Button>
    </form>
    </Form>
    {error && <p className='text-red-600'>{error.message}</p>}
    </div> );
}
 
export default Main_Form;