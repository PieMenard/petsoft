'use server';

import { signIn, signOut } from '@/lib/auth';
import prisma from '@/lib/db';
import { checkAuth, getPetById } from '@/lib/server-utils';
import { sleep } from '@/lib/utils';
import { authSchema, petFormSchema, petIdSchema } from '@/lib/validations';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

///---user actions---
export async function logIn(prevState: unknown, formData: unknown) {
  await sleep(1000);

  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data.',
    };
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return {
            message: 'Invalid credentials.',
          };
        }
        default:
          return {
            message: 'Could not sign in.',
          };
      }
    }
    throw error; //nextjs redirects throw error, so we need to rethrow it
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
  await sleep(1000);

  //check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data.',
    };
  }

  //convert formData to a plain object
  const formDataEntries = Object.fromEntries(formData.entries());

  //validation
  const valitedFormData = authSchema.safeParse(formDataEntries);
  if (!valitedFormData.success) {
    return {
      message: 'Invalid form data.',
    };
  }

  const { email, password } = valitedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        message: 'Email already registered.',
      };
    }

    return {
      message: 'Could not create user.',
    };
  }

  await signIn('credentials', formData);
}

export async function logOut() {
  await sleep(1000);
  await signOut({ redirectTo: '/' });
}

//--- pet actions ---
export async function addPet(pet: unknown) {
  await sleep(1000);

  //check if user is logged in and get their id
  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: 'Invalid pet data.',
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: 'Could not add pet.',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function editPet(petId: unknown, newPet: unknown) {
  await sleep(1000);

  //authentication check
  const session = await checkAuth();
  //validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPet);

  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: 'Invalid pet data.',
    };
  }

  //authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: 'Pet not found.',
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: 'Not authorized.',
    };
  }

  //database mutation
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: 'Could not edit pet.',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function deletePet(petId: unknown) {
  await sleep(1000);

  //authentication check
  const session = await checkAuth();

  //validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet data.',
    };
  }

  //authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: 'Pet not found.',
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: 'Not authorized.',
    };
  }

  //database mutation
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: 'Could not delete pet.',
    };
  }

  revalidatePath('/app', 'layout');
}
